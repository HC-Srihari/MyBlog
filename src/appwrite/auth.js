import {Account,Client,ID} from 'appwrite'
import conf from '../conf/conf'

class AuthService{
    client = new Client()
    account;
    constructor(){
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.projectId);

        this.account = new Account(this.client)
    }

    async createAccount({email,password,name}){
        try {
            const newUser = await this.account.create(ID.unique(),email,password,name);
            if(newUser){
               return this.login({email,password});
            }else{
                return newUser
            }
        } catch (error) {
            console.log('inside appwrite: auth: createAccount ',error);
            throw error
        }
    }

     
    async getCurrentUser(){
        try {
            return await this.account.get();
        } catch (error) {
            console.log('inside :appwrite:auth:getcurrentuser   ',error);
        }
    }

    
    async login({email,password}){
        try {
            return await this.account.createEmailSession(email,password)
        } catch (error) {
            console.log('inside appwrite:auth:login   ',error);
            throw error
        }
    }


    async logout(){
        try {
            return await this.account.deleteSessions();
        } catch (error) {
            console.log('inside appwrite: auth: logout  ',error);
        }
    }
}

const authService = new AuthService()
export default authService;
