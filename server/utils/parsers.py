from typing import Union


def unwrap_boolean(value: Union[int, str]) -> bool:
    """
    Convert various representations of boolean values to Python bool.

    Args:
        value: The value to convert to Python bool.

    Returns: The Python bool representation of the value.

    Raises:
        ValueError: If the value does not match any known boolean representation.
    """

    TRUE_VALUES = {"true", "True", "y", "yes", "1", 1}
    FALSE_VALUES = {"false", "False", "n", "no", "0", 0}

    if value in TRUE_VALUES:
        return True
    elif value in FALSE_VALUES:
        return False
    else:
        raise ValueError(f"Invalid boolean value: {value}")


def unwrap_list(value: Union[str, list]) -> list:
    """
    Unwrap a string representation of a list into a Python list.

    Args:
        value: The value to unwrap. It can be either a string representing a list or a list itself.

    Returns: The unwrapped list.

    Raises:
        ValueError: If the provided value is empty.
    """

    if not value:
        raise ValueError("Invalid list value")

    if isinstance(value, list):
        return value

    if value[0] == "[" and value[-1] == "]":
        value = value[1:-1]

    if value[-1] == ",":
        value = value[:-1]

    return value.split(",")
