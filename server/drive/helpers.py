
from secure_share.exceptions import BadRequest

from .models import Drive


def get_active_drive(request, raise_exception=True):
    drive_id = request.headers.get("X-Active-Drive-Id")

    if not drive_id and raise_exception:
        raise BadRequest("Active drive is required")
    elif not drive_id:
        return None

    try:
        return Drive.objects.get(id=drive_id)
    except Drive.DoesNotExist:
        if raise_exception:
            raise BadRequest("Active drive not found")
        return None
