to clean docker:
docker system prune -a

to open mongo bash inside docker bash
mongosh

to connect to mongo outside
mongosh "mongodb://username:password@host:port/database"


docker exec -it mongodb-container bash

mongosh -u admin -p adminpassword

mongosh -u admin -p adminpassword mydatabase

show dbs
use mydatabase
show collection
db.users.drop()