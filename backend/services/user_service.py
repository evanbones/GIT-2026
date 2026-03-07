USERS = {"1": "alice", "2": "bob"}  # placeholder, swap with DB calls


def get_all_users():
    return list(USERS.values())


def get_user(user_id):
    return USERS.get(str(user_id))


def create_user(data):
    new_id = str(len(USERS) + 1)
    USERS[new_id] = data.get("name")
    return {"id": new_id, "name": USERS[new_id]}


def delete_user(user_id):
    return USERS.pop(str(user_id), None)
