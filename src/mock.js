const Mock = require('mockjs');

let dayLyData = {
    "code": 0,
    "data": {
        "TxDaily": [
            { "Day": "2018-11-09", "NetworkId": "1", "TxCount": 11 },
            { "Day": "2018-11-12", "NetworkId": "1", "TxCount": 9 }
        ]
    },
    "message": "Success"
};

Mock.mock('/api/chainmakerproxy/interface', (req, res) => {
    req.body = JSON.parse(req.body)
    if (req.body.Module === 'tx_dayly' && req.body.Operation === 'get_dayly') {
        return dayLyData;
    }
});
