// Note: /opt/Common is where all the lib layer code gets put
const { Voter, ApiResponse, ApiRequire } = require("/opt/Common");

exports.lambdaHandler = async (event, context, callback) => {
  const requiredArgs = ["SSN4", "lastName", "yearOfBirth"];

  const messageBody = JSON.parse(event.body);

  if (!ApiRequire.hasRequiredArgs(requiredArgs, messageBody)) {
    return ApiResponse.makeRequiredArgumentsError();
  }

  const { SSN4, lastName, firstName, yearOfBirth } = messageBody;

  if (
    process.env.AWS_SAM_LOCAL ||
    process.env.DEPLOYMENT_ENVIRONMENT.startsWith("development")
  ) {
    if (SSN4.toLowerCase() === "emptyresponse") {
      return ApiResponse.makeResponse(200, Voter.emptyResponse);
    } else if (SSN4.toLowerCase() === "wrongresponse") {
      return ApiResponse.makeResponse(200, Voter.wrongResponse);
    } else if (SSN4.toLowerCase() === "noresponse") {
      return ApiResponse.makeResponse(200, Voter.noResponse);
    }
  }

  if (SSN4.length != 4) {
    return ApiResponse.makeErrorResponse({ error: "SSN4 wrong format" });
  }

  const voter = await Voter.findBySSN4(SSN4, lastName, firstName, yearOfBirth);
  if (!voter) {
    return ApiResponse.noMatchingVoter(messageBody);
  }

  return ApiResponse.makeResponse(200, voter.attributes);
};
