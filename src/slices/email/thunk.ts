import { createAsyncThunk } from "@reduxjs/toolkit";

import {
    getMailsListsId as getMailsListsIdApi,
    deleteMail as deleteMailApi,
    getMailsLists as getMailsListsApi,
    getSelectFolders as getSelectFoldersApi,
    getselectedmails as getSelectedMailsApi,
    getUpdateMail as getUpdateMailApi,
    setFolderOnSelectedMails as setFolderOnSelectedMailsApi,
    staredMail as staredMailApi,
    trashMail as trashMailApi
} from "../../helpers/fakebackend_helper";

export const getMailsLists = createAsyncThunk("email/getMailsLists", async () => {
    try {
        const response = getMailsListsApi();
        return response;
    } catch (error) {
        return error;
    }
});

// mails get with id
export const getMailsListsId = createAsyncThunk("email/getMailsListsId", async (id: string) => {
    try {
        const response = getMailsListsIdApi(id);
        return response;
    } catch (error) {
        return error;
    }
});

export const getSelectFolders = createAsyncThunk("email/getSelectFolders", async () => {
    try {
        const response = getSelectFoldersApi();
        return response;
    } catch (error) {
        return error;
    }
});

export const getSelectedMails = createAsyncThunk("email/getSelectedMails", async (emailId: number) => {
    try {
        const response = getSelectedMailsApi(emailId);
        return response;
    } catch (error) {
        return error;
    }
});


export const getUpdateMail = createAsyncThunk("email/getUpdateMail", async (email: any) => {
    try {
        const response = getUpdateMailApi(email)
        return response;
    } catch (error) {
        return error;
    }
});


export const staredMail = createAsyncThunk("email/staredMail", async (mail: any) => {
    try {
        const response = staredMailApi(mail);
        return response;
    } catch (error) {
        return error;
    }
});

export const trashMail = createAsyncThunk("email/trashMail", async (mail: any) => {
    try {
        const response = trashMailApi(mail);
        return response;
    } catch (error) {
        return error;
    }
});

export const deleteMail = createAsyncThunk("email/deletemail", async (mail: any) => {
    try {
        const response = deleteMailApi(mail);
        return response;
    } catch (error) {
        return error;
    }
})


export const folderOnSelectedMails = createAsyncThunk("mailbox/folderOnSelectedMails", async (data: any) => {
    try {
        const response = setFolderOnSelectedMailsApi(data)
        return response;
    } catch (error) {
        return error;
    }
});

