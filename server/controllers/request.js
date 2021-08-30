const Request = require('../models/Request');
const asyncHandler = require("express-async-handler");

// req.body has userId, sitterId, start, end, status, paid, request._id
// TODO => Handle status change cases

// GET /requests: list of requests for logged in user
exports.getRequests = asyncHandler( async (req, res, next) => {
    const { userId } = req.body;

    const requests = await Request.find()
        .then(() => {
            const userRequests = requests.filter(r => {
                return r.userId === userId;
            });
            res.status(200).json(userRequests);
        })
        .catch(err => console.log('Error getting requests:', err));
});

// POST /request: Create a new request
exports.createRequest = asyncHandler( async (req, res, next) => {
    const { userId, sitterId, start, end, status, paid } = req.body;

    const request = await Request.create({
        userId, 
        sitterId, 
        start, 
        end, 
        status,
        paid
    })

    if(request) {
        res.status(201).json(request);
    } else {
        res.status(500).end();
    }
});

// UPDATE /request/update/:id : Update request with approved or decline
exports.updateRequestStatus = asyncHandler( async (req, res, next) => {
    const request = req.body;
    const id  = req.params.id;
    const { status } = request;

    if (!id) {
        res.status(404);
    }
    await Request.findByIdAndUpdate(
        id,
        {
            $set: {
                status: status,
            }
        },
    )
    .then(() => {
        res.status(200);
    })
    .catch(err => {
        res.status(500);
    })
})