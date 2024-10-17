export const BACKEND_API_ENDPOINTS_MAP: Record<string, string> = {
    LOCATION:"/location",
    AUTH:"/auth",
    VEHICLE:"/vehicle",
    DRIVER:"/driver",
    PRICE:"/price",
    BOOKING:"/bookings",
    ADMIN:"/admin",
    PAYMENT:"/payment",
}

export const vehicles = [
    {
      type: "mini truck",
      desc: "A reliable truck for transporting cargo across short distances.",
      img: "/images/default.png",
      price: null,
      time: null,
    },
    {
      type: "truck",
      desc: "A reliable truck for transporting cargo across long distances over a country.",
      img: "/images/default.png",
      price: null,
      time: null,
    },
    {
      type: "big truck",
      desc: "A large truck designed for heavy-duty transportation, capable of carrying substantial loads over long distances.",
      img: "/images/default.png",
      price: null,
      time: null,
    },
  ];

  export const imgMaps={
    "mini truck":"/images/mini-truck.png",
    "truck":"/images/truck.png",
    "big truck":"/images/big-truck.png"
}