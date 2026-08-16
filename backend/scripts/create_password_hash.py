import getpass

import bcrypt


password = getpass.getpass("Admin password: ").encode()
print(bcrypt.hashpw(password, bcrypt.gensalt()).decode())
