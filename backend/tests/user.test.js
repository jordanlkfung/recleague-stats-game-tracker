const User = require('../models/User');

const { addUser, getUser, getUserLeagues } = require('../controllers/userController');
const AppError = require('../AppError');


jest.mock('../models/User');

describe('addUser controller', () => {
    it('should return status of 201 when new user is created', async () => {
        const req = {
            body: {
                email: 'test_email',
                password: 'test_password'
            }
        }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        }
        const mockUser = {
            email: 'test_email',
            password: 'test_password',
            _id: 1,
            createdAt: 'now',
            save: jest.fn().mockReturnValueOnce({
                email: 'test_email',
                password: 'test_password',
                _id: 1,
                createdAt: 'now',
            })
        }
        User.mockImplementationOnce(() => mockUser)
        // User.save.mockResolvedValue(() => ({
        //     id: 1,
        //     email: 'test_email'
        // }))
        await addUser(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            email: 'test_email',
            password: 'test_password',
            _id: 1,
            createdAt: 'now',
        });

    });
});
describe('getUser controller', () => {
    it('should return status of 200 when user is found', async () => {
        User.findById.mockReturnValueOnce({
            select: jest.fn().mockReturnValueOnce({
                _id: "abcdef",
                email: 'test_email',
            })
        });

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        }
        const request = {
            params: {
                _id: 'abcedf'
            }
        }
        await getUser(request, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            _id: "abcdef",
            email: 'test_email'
        });

    });

    it('should return status of 404 when user is not found', async () => {
        const req = {
            params: {
                _id: '67777f6dcc46208389f68c27'
            }
        }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        }
        User.findById.mockReturnValue({
            select: jest.fn().mockReturnValue(null)
        })
        const next = jest.fn();

        const error = new AppError(404, 'User not found.');
        await getUser(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });
})

describe('getting user leagues', () => {
    it('should return status of 200 and leagues of user when user is found', async () => {

        const mockUser = {
            leagues: ['league id'],
            email: 'test_email',
            populate: jest.fn().mockReturnValue({ leagues: ['league id'] })
            /**
             * user is set to the mockUser we created, since mockUser is not
             * a mongoose object, it doesn't have the 'populate' method,
             * therefore we have to mock it in mockUser so populate can
             * be called
             */
        };

        User.findById.mockReturnValueOnce(mockUser);

        const req = {
            params: {
                _id: '67777f6dcc46208389f68c27'
            }
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        }

        await getUserLeagues(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(mockUser.leagues);
    });

    it('should return status of 404 when user is not found', async () => {
        const req = {
            params: {
                _id: '67777f6dcc46208389f68c27'
            }
        }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        }
        User.findById.mockReturnValue(null)
        const next = jest.fn();

        const error = new AppError(404, 'User not Found.');
        await getUserLeagues(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });
});
