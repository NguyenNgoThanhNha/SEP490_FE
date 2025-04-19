import { del, get, post, ResponseProps } from "./root";
import axios from "axios";

const GHN_TOKEN = "e79a5ca7-014e-11f0-a9a7-7e45b9a2ff31";
const GOONG_API_KEY = "58y8peA3QXjke7sqZK4DYCiaRvcCbh6Jaffw5qCI";

interface BranchProps {
  page: number;
  pageSize: number;
  status: string;
}

const getAllBranch = async ({ status, page, pageSize }: BranchProps): Promise<ResponseProps> => {
  return await get(`Branch/get-list?status=${status}&page=${page}&pageSize=${pageSize}`);
};

const deleteBranch = async (branchId: number): Promise<ResponseProps> => {
  return await del(`Branch/delete/${branchId}`);
};

interface CreateBranchProps {
  branchName: string;
  branchAddress: string;
  branchPhone: string;
  longAddress: string;
  latAddress: string;
  status: string;
  managerId: number;
  companyId: number;
  district: number;
  wardCode: number;
}

const createBranch = async (data: CreateBranchProps): Promise<ResponseProps> => {
  return await post(`Branch/create`, data);
};

const getProvinces = async (): Promise<ResponseProps[]> => {
  const res = await axios.get("https://online-gateway.ghn.vn/shiip/public-api/master-data/province", {
    headers: { Token: GHN_TOKEN },
  });
  return res.data.data;
};

const getDistricts = async (provinceId: string): Promise<ResponseProps[]> => {
  const res = await axios.get("https://online-gateway.ghn.vn/shiip/public-api/master-data/district", {
    headers: { Token: GHN_TOKEN },
    params: { province_id: provinceId },
  });
  return res.data.data;
};

const getWards = async (districtId: number): Promise<ResponseProps[]> => {
  const res = await axios.get("https://online-gateway.ghn.vn/shiip/public-api/master-data/ward", {
    headers: { Token: GHN_TOKEN },
    params: { district_id: districtId },
  });
  return res.data.data;
};

const getCoordinates = async (fullAddress: string): Promise<{ lat: string; lng: string } | null> => {
  const res = await axios.get("https://rsapi.goong.io/geocode", {
    params: {
      address: fullAddress,
      api_key: GOONG_API_KEY,
    },
  });

  const result = res.data.results?.[0];
  if (!result) return null;

  return {
    lat: result.geometry.location.lat.toString(),
    lng: result.geometry.location.lng.toString(),
  };
};

const getBranchById = async (branchId: number): Promise<ResponseProps> => {
  return await get(`Branch/get-by-id/${branchId}`);
};

export default {
  getAllBranch,
  deleteBranch,
  createBranch,
  getProvinces,
  getDistricts,
  getWards,
  getCoordinates,
  getBranchById
};
