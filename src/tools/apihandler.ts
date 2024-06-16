import axios from 'axios';

export interface documents {
    _id: string,
    name: string,
    tested: boolean,
    rating: number,
    username: string,
}

export interface dbDocument {
    documents: documents[]
}
const dbURL = 'https://eu-central-1.aws.data.mongodb-api.com/app/data-zzpdbuw/endpoint/data/v1/action'

const dbAccountAxiosInstance = axios.create({
    baseURL: 'https://eu-central-1.aws.services.cloud.mongodb.com/api/client/v2.0/app/data-zzpdbuw/auth/providers/local-userpass/login',
    headers: {
        'Content-Type': 'application/json',
    },
});

async function dbToken() {
    const requestBody = {
        username: 'admin',
        password: 'MNmeRaQfOMGc8vG7'
    }
    try {
        const response = await dbAccountAxiosInstance.post('', requestBody);
        return response.data
    } catch (error) {
        console.error('Error getting dbtoken:', error);
    }
}
export async function getDocumentsFromDB(): Promise<dbDocument> {
    try {
        const getToken = await dbToken()
        const response = await axios.post(dbURL + '/find', {
            collection: "milkshakes",
            database: "milkshakes",
            dataSource: "Milkshake-cluster",
            filter: {}
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken.access_token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function updateDocument(username: string, shake: string, rating: number, tested: boolean) {
    try {
        const getToken = await dbToken()
        const response = await axios.post(dbURL + '/updateOne', {
            collection: "milkshakes",
            database: "milkshakes",
            dataSource: "Milkshake-cluster",
            filter: {
                username: username,
                name: shake
            },
            update: {
                $set: {
                    rating: rating,
                    tested: tested,
                }
            }
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken.access_token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function getUserFromDB(username: string) {
    try {
        const getToken = await dbToken()
        const response = await axios.post(dbURL + '/findOne', {
            collection: "user",
            database: "milkshakes",
            dataSource: "Milkshake-cluster",
            filter: {
                username: username,
            },
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken.access_token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
