from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User



# JWT Configuration
# --------------------------------------------------

SECRET_KEY = "849e328cc42caab87ce7870ce660c8d819a12e572a1af9ab2ae79e55ea70ed82"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


# Password Hashing
# --------------------------------------------------

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


# OAuth2 authentication scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")



# Hash Password
# --------------------------------------------------

def hash_password(password: str) -> str:
    """
    Hash user password using bcrypt.
    Bcrypt only supports up to 72 characters.
    """
    password = password[:72]
    return pwd_context.hash(password)



# Verify Password
# --------------------------------------------------

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Compare plain password with hashed password.
    """
    return pwd_context.verify(plain_password, hashed_password)


# Create JWT Token
# --------------------------------------------------

def create_access_token(
    data: dict,
    expires_delta: timedelta | None = None
) -> str:

    to_encode = data.copy()

    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )

    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return encoded_jwt


# Get Current Logged-in User
# --------------------------------------------------

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        user_id: int = payload.get("user_id")
        role: str = payload.get("role")

        if user_id is None:
            raise credentials_exception

    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.id == user_id).first()

    if user is None:
        raise credentials_exception

    return user


# Role-Based Access Control
# --------------------------------------------------

def require_role(role: str):
    """
    Restrict route access based on user role.
    Example roles: student, teacher, parent
    """

    def role_checker(
        current_user: User = Depends(get_current_user)
    ):

        if current_user.role != role:
            raise HTTPException(
                status_code=403,
                detail="Access forbidden"
            )

        return current_user

    return role_checker