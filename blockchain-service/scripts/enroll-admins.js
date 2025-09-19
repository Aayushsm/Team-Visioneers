const FabricCAServices = require('fabric-ca-client');
const { Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

async function main() {
    try {
        // Load the connection profile
        const ccpPath = path.resolve(__dirname, '..', 'config', 'connection-profile.yaml');
        const ccp = yaml.load(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new wallet for identities
        const walletPath = path.resolve(__dirname, '..', 'api', 'config', 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // Create a new CA client for interacting with the CA
        const caInfoTA = ccp.certificateAuthorities['ca.tourismauthority.com'];
        const caInfoSec = ccp.certificateAuthorities['ca.securityngo.com'];

        const caTA = new FabricCAServices(caInfoTA.url, {
            trustedRoots: caInfoTA.tlsCACerts.pem,
            verify: false
        }, caInfoTA.caName);

        const caSec = new FabricCAServices(caInfoSec.url, {
            trustedRoots: caInfoSec.tlsCACerts.pem,
            verify: false
        }, caInfoSec.caName);

        // Enroll Tourism Authority Admin
        const enrollmentTA = await caTA.enroll({
            enrollmentID: 'admin',
            enrollmentSecret: 'adminpw'
        });

        const identityTA = {
            credentials: {
                certificate: enrollmentTA.certificate,
                privateKey: enrollmentTA.key.toBytes(),
            },
            mspId: 'TourismAuthorityMSP',
            type: 'X.509',
        };

        await wallet.put('admin-tourism', identityTA);

        // Enroll Security NGO Admin
        const enrollmentSec = await caSec.enroll({
            enrollmentID: 'admin',
            enrollmentSecret: 'adminpw'
        });

        const identitySec = {
            credentials: {
                certificate: enrollmentSec.certificate,
                privateKey: enrollmentSec.key.toBytes(),
            },
            mspId: 'SecurityNGOMSP',
            type: 'X.509',
        };

        await wallet.put('admin-security', identitySec);

        console.log('Successfully enrolled admin users and imported into the wallet');
    } catch (error) {
        console.error(`Failed to enroll admin users: ${error}`);
        process.exit(1);
    }
}

main();