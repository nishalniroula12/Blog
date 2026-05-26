export const setitem = (posts) => {
    localStorage.setItem("posted", JSON.stringify(posts));
  };
  
  export const getitem = () => {
    const data = localStorage.getItem("posted");
    return data ? JSON.parse(data) : [];
  };                                                              