import api from "../api/axios";

export const resumenDia = async () => {
    const response = await api.get("/dashboard/resumen-dia");
    return response.data;
};

export const resumenSemana = async () => {
    const response = await api.get("/dashboard/resumen-semana");
    return response.data;
};

export const resumenMes = async () => {
    const response = await api.get("/dashboard/resumen-mes");
    return response.data;
};

export const resumenAnio = async () => {
    const response = await api.get("/dashboard/resumen-anio");
    return response.data;
};

export const topDia = async () => {
    const response = await api.get("/dashboard/top-productos");
    return response.data;
};

export const topSemana = async () => {
    const response = await api.get("/dashboard/top-productos-semana");
    return response.data;
};

export const topMes = async () => {
    const response = await api.get("/dashboard/top-productos-mes");
    return response.data;
};

export const topAnio = async () => {
    const response = await api.get("/dashboard/top-productos-anio");
    return response.data;
};