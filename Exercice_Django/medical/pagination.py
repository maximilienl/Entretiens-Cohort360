from __future__ import annotations

from rest_framework.pagination import LimitOffsetPagination

ALLOWED_ELEMENTS_SIZES = {20, 50, 100, 200}


class ConfigurableLimitOffsetPagination(LimitOffsetPagination):
    """Pagination par offset + elements : ?offset=40&elements=20."""

    default_limit = 20
    max_limit = 200
    limit_query_param = "elements"
    offset_query_param = "offset"

    def get_limit(self, request) -> int:
        requested = request.query_params.get(self.limit_query_param)
        if requested is not None:
            try:
                size = int(requested)
            except (ValueError, TypeError):
                return self.default_limit
            if size in ALLOWED_ELEMENTS_SIZES:
                return size
        return self.default_limit
