const User = require('../models/User');

const { addUser, getUser } = require('../controllers/userController');
const AppError = require('../AppError');



jest.mock('../models/User', () => ({
    findById: jest.fn(),
}));
const req = {
    body: {
        email: 'test_email',
        password: 'test_password'
    }
}
// it('should return status of 201 when new user is added', async () => {
//     User.prototype.save.mockResolvedValue(() => ({
//         id: 1,
//         email: 'test_email'
//     }))
//     await addUser(req)

// });
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
        await getUser(req, res, next)

        // expect(next).toHaveBeenCalledWith(expect.objectContaining({
        //     statusCode: 404,
        //     message: 'User not found',
        // }));

        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    })
})
