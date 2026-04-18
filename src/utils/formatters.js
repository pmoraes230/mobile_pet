export const formateDate = (dateString) => {
    if(!dateString) return "Não informado";

    const date = new Date(dateString);

    return date.toLocaleDateString("pt-br", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    })
}

export const formateCPF = (cpf) => {
    if(!cpf) return "Não informado";

    const clearCPF = cpf.replace(/\D/g, "");

    return clearCPF.replace(
        /(\d{3})(\d{3})(\d{3})(\d{2})/,
        "$1.$2.$3-$4"
    )
}