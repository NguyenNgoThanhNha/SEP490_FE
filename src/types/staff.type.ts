import { TBranch } from "./branch.type"

export type TStaff = {
    staffId: number,
    userId: number,
    branchId: number,
    staffInfo: {
        userId: number,
        userName: string,
        fullName: string,
        email: string,
        avatar: string,
        gender: string,
        city: string,
        address: string,
        phoneNumber: string,
        birthDate: string,
        status: string
    },
    branch: TBranch
}