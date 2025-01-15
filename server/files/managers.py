import string

from django.db import models
from nanoid import generate


class FileShareLinkManager(models.Manager):
    def __generate_slug(self):
        MAX_ATTEMPTS = 10
        alphabet = string.ascii_letters + string.digits

        for _ in range(MAX_ATTEMPTS):
            slug = generate(alphabet, 8)
            if not self.model.objects.filter(slug=slug).exists():
                return slug

        raise ValueError("Could not generate unique slug after multiple attempts")

    def create(self, **kwargs):
        kwargs["slug"] = self.__generate_slug()
        return super().create(**kwargs)
