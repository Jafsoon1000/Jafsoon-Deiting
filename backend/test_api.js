const http = require('http');

const postData = (path, data, token) => {
    return new Promise((resolve, reject) => {
        const bodyStr = JSON.stringify(data);
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(bodyStr)
            }
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(body) }));
        });

        req.on('error', reject);
        req.write(bodyStr);
        req.end();
    });
};

const getData = (path, token) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: 'GET',
            headers: {}
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(body) }));
        });

        req.on('error', reject);
        req.end();
    });
};

const putData = (path, data, token) => {
    return new Promise((resolve, reject) => {
        const bodyStr = JSON.stringify(data);
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(bodyStr)
            }
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(body) }));
        });

        req.on('error', reject);
        req.write(bodyStr);
        req.end();
    });
};

async function runTests() {
    console.log('Starting API integration tests...');
    
    // 1. Signup a test user
    const email = `test_${Date.now()}@example.com`;
    const signupRes = await postData('/api/auth/signup', {
        name: 'Test User',
        email: email,
        password: 'password123'
    });

    console.log('Signup response:', signupRes);
    if (signupRes.status !== 201) {
        throw new Error('Signup failed');
    }

    const token = signupRes.body.token;

    // 2. Fetch the sync details (defaults)
    const getRes = await getData('/api/user/sync', token);
    console.log('Get Sync response status:', getRes.status);
    console.log('Get Sync response data:', getRes.body.data);
    if (getRes.status !== 200) {
        throw new Error('Get sync failed');
    }

    // 3. Update sync data (profile metrics + meals)
    const updateRes = await putData('/api/user/sync', {
        userGoal: 'Lose Weight',
        userCalorieTarget: 1800,
        userMeals: [{ name: 'Salad', calories: 350 }]
    }, token);

    console.log('Update Sync response status:', updateRes.status);
    console.log('Update Sync response data:', updateRes.body.data);
    if (updateRes.status !== 200 || updateRes.body.data.userGoal !== 'Lose Weight') {
        throw new Error('Update sync failed');
    }

    // 4. Retrieve again to verify persistence
    const verifyRes = await getData('/api/user/sync', token);
    console.log('Verify Sync response data:', verifyRes.body.data);
    if (verifyRes.body.data.userCalorieTarget !== 1800) {
        throw new Error('Verification failed: data not persisted correctly');
    }

    console.log('✅ All tests passed successfully!');
}

runTests().catch(err => {
    console.error('❌ Tests failed:', err);
    process.exit(1);
});
