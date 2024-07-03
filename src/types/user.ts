
export interface User {
    id: number;
    name: string;
    password: string;
    email: string;
    phone: string;
    role: string;
    date: string;
}

export interface Register {
    username: string;
    password: string;
    email: string;
}

export interface UserModel {
    id: number | null;
    username: string;
    password: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    description: string;
    status: string;
    // create_time: string;
    // update_time: string;
}

export interface MessageSent {
    content: string;
    messageType: string;

}

export interface MessageReceive {
    userId: number;
    content: string;
    messageType: string;
    createdAt: string;
}