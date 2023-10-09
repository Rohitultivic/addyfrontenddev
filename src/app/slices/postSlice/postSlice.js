import {createSlice} from '@reduxjs/toolkit'
import {
    generateAIImageAction,
    generateAIHashTagAction,
    generateAICaptionAction,
    createFacebookPostAction,
    getAllPostsForPlannerAction,
    getAllPostsByBatchIdAction,
    updatePostOnSocialMediaAction,
    getPlannerPostCountAction,
    deletePostByBatchIdAction,
    getAllDraftPostsByCustomerAndPeriodAction, publishedPostAction
} from "../../actions/postActions/postActions.js";


const postSlice = createSlice({
    name: 'post',
    initialState: {
        generateAIImageReducer: {loading: false},
        generateAIHashTagReducer: {loading: false},
        generateAICaptionReducer: {loading: false},
        createFacebookPostActionReducer: {loading: false},
        getAllPostsForPlannerReducer: {loading: false},
        getAllPostsByBatchIdReducer: {loading: false},
        updatePostOnSocialMediaReducer: {loading: false},
        getPlannerPostCountReportReducer: {loading: false},
        getAllDraftPostsByCustomerAndPeriodReducer: {loading: false},
        publishedPostReducer: {loading: false},
        deletePostByBatchIdReducer:{loading:false}
    },

    reducers: {
        resetPublishedPostReducer: (state) => {
            state.publishedPostReducer = {loading: false, data: null}
        }
    },

    extraReducers: {

        [publishedPostAction.pending]: (state) => {
            state.publishedPostReducer = {loading: true}
        },
        [publishedPostAction.fulfilled]: (state, action) => {
            state.publishedPostReducer = {loading: false, data: action.payload}
        },
        [publishedPostAction.rejected]: (state) => {
            state.publishedPostReducer = {loading: false}
        },

        [deletePostByBatchIdAction.pending]: (state) => {
            state.deletePostByBatchIdReducer = {loading: true}
        },
        [deletePostByBatchIdAction.fulfilled]: (state, action) => {
            console.log("====>",action);
            state.deletePostByBatchIdReducer = {loading: false, data: "success"}},
        [deletePostByBatchIdAction.rejected]: (state) => {state.deletePostByBatchIdReducer = {loading: false}},


        [updatePostOnSocialMediaAction.pending]: (state) => {
            state.updatePostOnSocialMediaReducer = {loading: true}
        },
        [updatePostOnSocialMediaAction.fulfilled]: (state, action) => {
            state.updatePostOnSocialMediaReducer = {loading: false, data: action.payload}
        },
        [updatePostOnSocialMediaAction.rejected]: (state) => {
            state.updatePostOnSocialMediaReducer = {loading: false}
        },

        //get all posts by batch id
        [getAllPostsByBatchIdAction.pending]: (state) => {
            state.getAllPostsByBatchIdReducer = {loading: true}
        },
        [getAllPostsByBatchIdAction.fulfilled]: (state, action) => {
            state.getAllPostsByBatchIdReducer = {loading: false, data: action.payload}
        },
        [getAllPostsByBatchIdAction.rejected]: (state) => {
            state.getAllPostsByBatchIdReducer = {loading: false}
        },

        //get all posts for planner
        [getAllPostsForPlannerAction.pending]: (state) => {
            state.getAllPostsForPlannerReducer = {loading: true}
        },
        [getAllPostsForPlannerAction.fulfilled]: (state, action) => {
            state.getAllPostsForPlannerReducer = {loading: false, data: action.payload}
        },
        [getAllPostsForPlannerAction.rejected]: (state) => {
            state.getAllPostsForPlannerReducer = {loading: false}
        },

        [getAllDraftPostsByCustomerAndPeriodAction.pending]: (state) => {
            state.getAllDraftPostsByCustomerAndPeriodReducer = {loading: true}
        },
        [getAllDraftPostsByCustomerAndPeriodAction.fulfilled]: (state, action) => {
            state.getAllDraftPostsByCustomerAndPeriodReducer = {loading: false, data: action.payload}
        },
        [getAllDraftPostsByCustomerAndPeriodAction.rejected]: (state) => {
            state.getAllDraftPostsByCustomerAndPeriodReducer = {loading: false}
        },

        //get all posts for planner
        [getPlannerPostCountAction.pending]: (state) => {
            state.getPlannerPostCountReportReducer = {loading: true}
        },
        [getPlannerPostCountAction.fulfilled]: (state, action) => {
            state.getPlannerPostCountReportReducer = {loading: false, data: action.payload}
        },
        [getPlannerPostCountAction.rejected]: (state) => {
            state.getPlannerPostCountReportReducer = {loading: false}
        },

        //ai generate image
        [generateAIImageAction.pending]: (state) => {
            state.generateAIImageReducer = {loading: true}
        },
        [generateAIImageAction.fulfilled]: (state, action) => {
            state.generateAIImageReducer = {loading: false, data: action.payload}
        },
        [generateAIImageAction.rejected]: (state) => {
            state.generateAIImageReducer = {loading: false}
        },

        //  ai generate hash tag
        [generateAIHashTagAction.pending]: (state) => {
            state.generateAIHashTagReducer = {loading: true}
        },
        [generateAIHashTagAction.fulfilled]: (state, action) => {
            state.generateAIHashTagReducer = {loading: false, data: action.payload}
        },
        [generateAIHashTagAction.rejected]: (state) => {
            state.generateAIHashTagReducer = {loading: false}
        },

        //  ai generate caption
        [generateAICaptionAction.pending]: (state) => {
            state.generateAICaptionReducer = {loading: true}
        },
        [generateAICaptionAction.fulfilled]: (state, action) => {
            state.generateAICaptionReducer = {loading: false, data: action.payload}
        },
        [generateAICaptionAction.rejected]: (state) => {
            state.generateAICaptionReducer = {loading: false}
        },

        [createFacebookPostAction.pending]: (state) => {
            state.createFacebookPostActionReducer = {loading: true}
        },
        [createFacebookPostAction.fulfilled]: (state) => {
            state.createFacebookPostActionReducer = {loading: false}
        },
        [createFacebookPostAction.rejected]: (state) => {
            state.createFacebookPostActionReducer = {loading: false}
        },


    }
});

export const {resetPublishedPostReducer} = postSlice.actions;
export default postSlice.reducer;
