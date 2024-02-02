import React,{useCallback,useEffect} from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import service from '../../appwrite/config'
import RTE from '../RTE'

function PostForm({post}) {

    const {register, handleSubmit, watch, setValue, control, getValues} = useForm({
        defaultValues:{
            title:post?.title || '',
            slug:post?.id || '',
            content:post?.content || '',
            status: post?.status || 'active'
        },
    }
    )

    const navigate = useNavigate();
    const userData = useSelector((state)=>(state.auth.userData));

    const submit = async(data)=>{
        if(post){
            const file = data.imaage[0]? await service.uploadFile(data.image[0]) :null

            if(file){
                await service.deleteFile(post.featuredImage)
            }

            const dbPost = await service.updatePost(
                post.$id,
                {
                    ...data,
                    featuredImage:file? file.$id:null
                }
            )

            if(dbPost){
                navigate(`/post/${dbPost.$id}`)
            }
        }else{
            const file = await service.uploadFile(data.image[0]);
            if(file){
                const fileId = file.$id;
                data.featuredImage = fileId
               const  dbPost = await service.createPost({ ...data, userId: userData.$id });

                if(dbPost){
                    navigate(`/post/${dbPost.$id}`)
                }
            }
        }
    };

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");

        return "";
    }, []);

    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);


  return (
     <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/3 px-2">
                <input
                    label="Title :"
                    placeholder="Title"
                     className='px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full mt-4'
                    {...register("title", { required: true })}
                />
                <input
                    label="Slug :" readOnly={true}
                    placeholder="Slug"
                     className='px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full mb-4'
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>
            <div className="w-1/3 px-2">
                <input
                    label="Featured Image :"
                    type="file"
                     className='px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full mb-4'
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={service.getFilePreview(post.featuredImage)}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}
                <select label="Status"
                    className="mb-4 px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full"
                    {...register("status", { required: true })}>
                    <option value="active">active</option>
                    <option value="inactive">inactive</option>
                </select>
                {/* <select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                /> */}
                <button type="submit"  className={`w-full px-4 py-2 rounded-lg ${post ? "bg-green-500" : "bg-blue-500"}`}>
                    {post ? "Update" : "Submit"}
                </button>
            </div>
        </form>
  )
}

export default PostForm
