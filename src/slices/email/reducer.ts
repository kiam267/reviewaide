import { createSlice } from "@reduxjs/toolkit";

import {
    getMailsLists, getSelectFolders, getSelectedMails, folderOnSelectedMails, getMailsListsId,
    getUpdateMail, deleteMail,
    trashMail, staredMail
} from "./thunk";

export const initialState = {
    mailsLists: [],
    mailsListsId: [],
    selectFolders: [],
    selectedmails: [],
    folderId: [],
    error: {},
    loading: true
};

const EmailsSlice = createSlice({
    name: 'EmailsSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getMailsLists.fulfilled, (state: any, action: any) => {
            const updatedMailsList = action.payload?.map((mail: any) => {
                if (mail.id === state.mailsListsId.id) {
                    return { ...mail, read: true }
                }
                return mail;
            });
            state.mailsLists = updatedMailsList;
            state.loading = true;
        });
        builder.addCase(getMailsLists.rejected, (state: any, action: any) => {
            state.error = action.payload ? action.payload?.error : null;
        });

        builder.addCase(getMailsListsId.fulfilled, (state: any, action: any) => {
            state.mailsListsId = action.payload;
        });
        builder.addCase(getMailsListsId.rejected, (state: any, action: any) => {
            state.error = action.payload ? action.payload?.error : null;
        });

        builder.addCase(staredMail.fulfilled, (state: any, action: any) => {
            state.mailsLists = state.mailsLists.map((mail: any) => {
                if (mail.id === action.payload) {
                    const newCategory = mail.category === "starred" ? "inbox" : "starred";
                    return { ...mail, category: newCategory };
                }
                return mail;
            });
        });

        builder.addCase(staredMail.rejected, (state: any, action: any) => {
            state.error = action.payload ? action.payload?.error : null;
        });

        builder.addCase(trashMail.fulfilled, (state: any, action: any) => {

            state.mailsLists = state.mailsLists.map((mail: any) => {
                if (mail.id === action.payload) {
                    return { ...mail, category: "trash" };
                }
                return mail;
            });
        });

        builder.addCase(trashMail.rejected, (state: any, action: any) => {
            state.error = action.payload ? action.payload?.error : null;
        });

        builder.addCase(deleteMail.fulfilled, (state: any, action: any) => {
            state.mailsLists = state.mailsLists.filter(
                (mail: any) => mail.id !== action.payload
            );
        });

        builder.addCase(deleteMail.rejected, (state: any, action: any) => {
            state.error = action.payload ? action.payload?.error : null;
        });

        builder.addCase(getUpdateMail.fulfilled, (state: any, action: any) => {
            state.mailsLists = state.mailsLists.map((lists: any) =>
                lists.id === action.payload.id
                    ? { ...lists, ...action.payload }
                    : lists
            );
        });

        builder.addCase(getUpdateMail.rejected, (state: any, action: any) => {
            state.error = action.payload ? action.payload?.error : null;
        });

        builder.addCase(getSelectFolders.fulfilled, (state: any, action: any) => {
            state.selectFolders = action.payload;
        });
        builder.addCase(getSelectFolders.rejected, (state: any, action: any) => {
            state.error = action.payload ? action.payload?.error : null;
        });
        builder.addCase(getSelectedMails.fulfilled, (state: any, action: any) => {
            state.selectedmails = action.payload ? (action.payload.length > 1) ? action.payload : state.selectedmails.includes(action.payload)
                ? state.selectedmails.filter((id: any) => id !== action.payload)
                : [...state.selectedmails, action.payload] : [];
        });
        builder.addCase(getSelectedMails.rejected, (state: any, action: any) => {
            state.error = action.payload ? action.payload?.error : null;
        });

        builder.addCase(folderOnSelectedMails.fulfilled, (state: any, action: any) => {
            state.mailsLists = state.mailsLists.map((data: any) => {
                if (data.id === action.payload) {
                    return { ...data, folder: 4 };
                }
                return data;
            });
        });
        builder.addCase(folderOnSelectedMails.rejected, (state: any, action: any) => {
            state.error = action.payload.error || null;
        });
    }
});

export default EmailsSlice.reducer;