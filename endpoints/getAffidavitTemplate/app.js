const { Election, ApiResponse } = require("/opt/Common");

exports.lambdaHandler = async (event, context, callback) => {
  const election = await Election.currentElection();
  if (!election) {
    return ApiResponse.noElectionResponse();
  }

  const url = election.affidavitTemplateURL();

  return ApiResponse.makeResponse(200, { affidavitTemplateURL: url });
};
