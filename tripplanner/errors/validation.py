
class ValidationError(Exception):

    def __init__(self, error_msg: str):
        self._errorMsg = error_msg

    def get_error_message(self):
        return self._errorMsg
