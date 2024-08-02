
// export const formatPrice = (price) => {
//     if (price === null || price === undefined) {
//         return "";
//     }

//     return Number(price).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace('₫', '').trim() + ' ₫';;
// };

export const formatPrice = (str) => {
    const num = parseFloat(str);
    if (isNaN(num)) {
        return '$NaN';
    } else {
        return '$' + num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }
}


export const formatDate = (dateString) => {

    if (dateString === null || dateString === undefined) {
        return "";
    }

    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // January is 0!
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export const formatDateOnly = (dateString) => {

    if (dateString === null || dateString === undefined) {
        return "";
    }

    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // January is 0!
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};