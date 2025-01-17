from enum import Enum


class DriveMemberRole(Enum):
    ADMIN = 'admin'
    REGULAR = 'regular'
    GUEST = 'guest'

    @classmethod
    def choices(cls):
        return [(key.value, key.name) for key in cls]
