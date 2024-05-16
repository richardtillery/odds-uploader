#
# Odds Uploader Lambda
#
Input example:
{
  "teamA": "TB",
  "teamB": "NE",
  "date": "20240514",
  "line": "-140"
}

#
# Prereqs for local testing:
#
fire up redis:
> redis-server
connect if necessary to have a look:
> redis-cli -h localhost -p 6379

#
# Test usage via command line:
#
> npm install
> npm run test
