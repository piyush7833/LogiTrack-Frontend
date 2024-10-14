export const BACKEND_API_ENDPOINTS_MAP: Record<string, string> = {
    LOCATION:"/location",
    AUTH:"/auth",
    VEHICLE:"/vehicle",
    DRIVER:"/driver",
    PRICE:"/price",
    BOOKING:"/booking",
}

export const vehicles = [
    {
      type: "Mini truck",
      desc: "A reliable truck for transporting cargo across short distances.",
      img: "/images/default.png",
      price: null,
      time: null,
    },
    {
      type: "Truck",
      desc: "A reliable truck for transporting cargo across long distances over a country.",
      img: "/images/default.png",
      price: null,
      time: null,
    },
    {
      type: "Big truck",
      desc: "A large truck designed for heavy-duty transportation, capable of carrying substantial loads over long distances.",
      img: "/images/default.png",
      price: null,
      time: null,
    },
  ];