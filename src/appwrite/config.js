import conf from "../conf/conf";
import {Client,Storage,Databases,ID,Query} from 'appwrite'

class CofigureService{
    client = new Client();
    database;
    bucket;  //here bucker refers to the storage which contains the images

    constructor(){
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.projectId);

        this.database = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    async createPost({title,slug,content,featuredImage,status,userId}){
        try {
            return await this.database.createDocument(
                conf.databaseId,
                conf.collectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                    userId
                }
            )
        } catch (error) {
            console.log('inside appwrite: config: createPost  ',error);
        }
    }


    async updatePost(slug,{title,content,featuredImage,status}){
        try {
            return await this.database.updateDocument(
                conf.databaseId,
                conf.collectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status
                }
            )
        } catch (error) {
            console.log('inside appwrite: config: updatePost ',error);
        }
    }

    async deletePost(slug){
        try {
            return await this.database.deleteDocument(
                conf.databaseId,
                conf.collectionId,
                slug
            )
        } catch (error) {
            console.log("inside appwrite: config: deletePost ", error);
        }
    }

    async getPost(slug){
        try {
            return await this.database.getDocument(
                conf.databaseId,
                conf.collectionId,
                slug
            )
        } catch (error) {
            console.log("inside appwrite: config: getPost ", error);
        }
    }

    async getPosts(queries = [Query.equal('status','active')]){
        try {
            return await this.database.listDocuments(
                conf.databaseId,
                conf.collectionId,
                queries
            )
        } catch (error) {
            console.log("inside appwrite: config: getPosts ", error);
        }
    }

    async uploadFile(file){
        try {
            return await this.bucket.createFile(
                conf.bucketId,
                ID.unique(),
                file
            )
        } catch (error) {
            console.log("inside appwrite: config: uploadFile ", error);
        }
    }

    async deleteFile(fileId){
        try {
            return await this.bucket.deleteFile(
                conf.bucketId,
                fileId
            )
        } catch (error) {
            console.log("inside appwrite: config: deleteFile ", error);
        }
    }

    getFilePreview(fileId){
        
            return  this.bucket.getFilePreview(
                conf.bucketId,
                fileId
            )
      
    }



}

const service = new CofigureService();
export default service;
