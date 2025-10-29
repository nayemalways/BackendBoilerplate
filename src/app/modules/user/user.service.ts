

const getAllUsersService = async () => {
    const users = [
        {
            name: "Nayem Ahmed",
            city: "Bhola"
        }
    ]


    return users;
}

// Export All Services
export const userServices = {
    getAllUsersService
}