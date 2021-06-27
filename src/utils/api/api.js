



export const getUrl = {
    addUser: '/user',
    userInfo:  ( id: number | undefined ): string => `/user/${id}`,
};

export default api;
