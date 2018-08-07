const chai = require("chai");
const assert = chai.assert;
const proxyquire = require("proxyquire");

const mockJwsToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InRlc3Qta2lkIn0.eyJpc3MiOiJ0ZXN0LWN1c3RvbS1pZGVudGl0eSIsInN1YiI6InRlc3QtdW5pcXVlLXVzZXItaWQiLCJhdWQiOiJ0ZXN0LWFwcGlkLW9hdXRoLmJsdWVtaXgubmV0IiwiZXhwIjo5OTk5OTk5OTk5LCJuYW1lIjoidGVzdC11c2VyLW5hbWUiLCJlbWFpbCI6InRlc3QtdXNlci1lbWFpbCIsImdlbmRlciI6InRlc3QtdXNlci1nZW5kZXIiLCJwaWN0dXJlIjoidGVzdC11c2VyLXBpY3R1cmUiLCJsb2NhbGUiOiJ0ZXN0LXVzZXItbG9jYWxlIiwiZ3JvdXAiOiJjdXN0b20gaWRwIGdyb3VwIiwic2NvcGUiOiJjdXN0b21TY29wZSIsImlhdCI6OTk5OTk5OTk5OX0.NUCyUyxxfhVVmuYYW2atBKmo9anqBEIFV3IPNShPKI6Ssl9t-Wx0DlKG-bGxr5d6tABoWFgE_7tat0Y6F-LEEcLeLeJSCyEU9PC245xNnyRlbKaZtGOj3ii_n6AV9AW-fKuTiPMXfaqMWyudyxCXVH_J5mubegAyelwxA0VxfeY';

const mockAccessToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpPU0UiLCJraWQiOiJ0ZXN0LWtpZCJ9.eyJpc3MiOiJ0ZXN0LWFwcGlkLW9hdXRoLmJsdWVtaXgubmV0IiwiZXhwIjo5OTk5OTk5OTk5LCJhdWQiOiJ0ZXN0LWNsaWVudC1pZCIsInN1YiI6InRlc3Qtc3ViIiwiYW1yIjpbImFwcGlkX2N1c3RvbSJdLCJpYXQiOjk5OTk5OTk5OTksInRlbmFudCI6InRlc3QtdGVuYW50LWlkIiwic2NvcGUiOiJvcGVuaWQgYXBwaWRfZGVmYXVsdCBhcHBpZF9yZWFkcHJvZmlsZSBhcHBpZF9yZWFkdXNlcmF0dHIgYXBwaWRfd3JpdGV1c2VyYXR0ciBhcHBpZF9hdXRoZW50aWNhdGVkIGN1c3RvbVNjb3BlIn0.SGNED1HBVjdqc7NEwsjOIwtIlhgNseVE6QzRrEAuRaej4RHhq1Fxyhc-r__1qdCFI2ZmUx02jSGvg2lyj7f1nm8ax9CbjW3TpOGJQjA-EPX8PUnbG-sTeusO24PEZP04Qcquga9t-dON3Uy20sDNk3WcDvb_dxtYo6NPco5Y0bQ';

const mockIdentityToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpPU0UiLCJraWQiOiJ0ZXN0LWtpZCJ9.eyJpc3MiOiJ0ZXN0LWFwcGlkLW9hdXRoLmJsdWVtaXgubmV0IiwiYXVkIjoidGVzdC1jbGllbnQtaWQiLCJleHAiOjk5OTk5OTk5OTksInRlbmFudCI6InRlc3QtdGVuYW50LWlkIiwiaWF0Ijo5OTk5OTk5OTk5LCJlbWFpbCI6InRlc3QtdXNlci1lbWFpbCIsIm5hbWUiOiJ0ZXN0LXVzZXItbmFtZSIsImdlbmRlciI6InRlc3QtdXNlci1nZW5kZXIiLCJsb2NhbGUiOiJ0ZXN0LXVzZXItbG9jYWxlIiwicGljdHVyZSI6InRlc3QtdXNlci1waWN0dXJlIiwic3ViIjoidGVzdC1zdWIiLCJpZGVudGl0aWVzIjpbeyJwcm92aWRlciI6ImFwcGlkX2N1c3RvbSIsImlkIjoidGVzdC11bmlxdWUtdXNlci1pZCJ9XSwiYW1yIjpbImFwcGlkX2N1c3RvbSJdfQ.LX627K3x69Z_BeMw1iQ5aFJf2PjRte-wa81wdmW47VuleahhYRTmXguGxhwad3GTTtDfwhtL0muxAVgywgyyQ5c3gz1pSZ-k-b2M6vu39Owap3pb7NZXNoqA34us17E4zfqXSVzXMWEwfnhlX5bQZdCpUVypmGwsG4ng94f26m4';

const mockTokenResponse = {
	access_token: mockAccessToken,
	id_token: mockIdentityToken,
	token_type: 'Bearer',
	expires_in: 9999999999
};

const SUCCESS = 'success';
const INVALID_ACCESS_TOKEN = 'invalid_access_token';
const INVALID_IDENTITY_TOKEN = 'invalid_identity_token';
const BAD_REQUEST = 'return_code:400';
const UNAUTHORIZED = 'return_code:401';
const NOT_FOUND = 'return_code:404';
const SERVER_ERROR = 'return_code:500';

const mockConfig = (event) => ({
	tenantId: 'test-tenant-id',
	clientId: 'test-client-id',
	secret: `secret ${event}`,
	oauthServerUrl: 'https://test-appid-oauth.bluemix.net/oauth/v3/test-tenant-id'
});

function getErrorResponse(statusCode) {
	let errorResponse = { statusCode };
	if (statusCode === 400) {
		errorResponse['error_description'] = 'Bad request';
	} else if (statusCode === 401) {
		errorResponse['error_description'] = 'Unauthorized';
	} else if (statusCode === 404) {
		errorResponse['error_description'] = 'Not Found';
	} else {
		errorResponse['error_description'] = 'Unexpected error';
	}
	return errorResponse
}

function mockRequest(options, callback) {
	const secret = options.auth.password;
	if (secret.includes(INVALID_ACCESS_TOKEN)) {
		const mockInvalidTokenResponse = Object.create(mockTokenResponse);
		mockInvalidTokenResponse['access_token'] = 'invalid_token';
		return callback(null, {
			statusCode: 200
		}, mockInvalidTokenResponse);
	} else if (secret.includes(INVALID_IDENTITY_TOKEN)) {
		const mockInvalidTokenResponse = Object.create(mockTokenResponse);
		mockInvalidTokenResponse['id_token'] = 'invalid_token';
		return callback(null, {
			statusCode: 200
		}, mockInvalidTokenResponse);
	} else if (secret.includes(SUCCESS)) {
		return callback(null, {
			statusCode: 200
		}, mockTokenResponse)
	} else if (secret.includes('return_code')) {
		const statusCode = parseInt(secret.split(':')[1]);
		return callback(null, {
			statusCode
		}, getErrorResponse(statusCode));
	}
}

function mockRetrieveTokenFailure(tokenManager, expectedErrMessage, done) {
	tokenManager.getCustomIdentityTokens(mockJwsToken)
		.catch((error) => {
			assert.equal(error.message, expectedErrMessage);
			done();
		});
}

describe('/lib/token-manager/token-manager', () => {
	let TokenManager;

	before(() => {
		TokenManager = proxyquire("../lib/token-manager/token-manager", {
			"../utils/token-util": require("./mocks/token-util-mock"),
			"request": mockRequest
		});
	});

	describe('#TokenManager.getCustomIdentityTokens', () => {
		it('Should fail access token validation', function (done) {
			const tokenManager = new TokenManager(mockConfig(INVALID_ACCESS_TOKEN));
			mockRetrieveTokenFailure(tokenManager, 'Invalid access token', done);
		});

		it('Should fail identity token validation', function (done) {
			const tokenManager = new TokenManager(mockConfig(INVALID_IDENTITY_TOKEN));
			mockRetrieveTokenFailure(tokenManager, 'Invalid identity token', done);
		});

		it('Should fail to retrieve tokens - 400', function (done) {
			const tokenManager = new TokenManager(mockConfig(BAD_REQUEST));
			mockRetrieveTokenFailure(tokenManager, 'Failed to obtain tokens', done);
		});

		it('Should not retrieve tokens - 401', function (done) {
			const tokenManager = new TokenManager(mockConfig(UNAUTHORIZED));
			mockRetrieveTokenFailure(tokenManager, 'Unauthorized', done)
		});

		it('Should not retrieve tokens - 404', function (done) {
			const tokenManager = new TokenManager(mockConfig(NOT_FOUND));
			mockRetrieveTokenFailure(tokenManager, 'Not found', done);
		});

		it('Should not retrieve tokens - 500', function (done) {
			const tokenManager = new TokenManager(mockConfig(SERVER_ERROR));
			mockRetrieveTokenFailure(tokenManager, 'Unexpected error', done);
		});

		it('Should retrieve tokens - Happy Flow', (done) => {
			const tokenManager = new TokenManager(mockConfig(SUCCESS));
			tokenManager.getCustomIdentityTokens(mockJwsToken)
				.then((context) => {
					assert.equal(context.accessToken, mockAccessToken);
					assert.equal(context.identityToken, mockIdentityToken);
					assert.equal(context.expiresIn, 9999999999);
					assert.equal(context.tokenType, 'Bearer');
					done();
				})
				.catch((error) => done(error));
		});
	});
});