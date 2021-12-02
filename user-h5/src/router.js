import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory("/"),
    routes: [{
            path: "/",
            name: "Index",
            component: () =>
                import ("./pages/Index.vue"),
        },
        {
            path: "/open-card/:id",
            name: "OpenCard",
            component: () =>
                import ("./pages/OpenCard.vue"),
        },
        {
            path: "/my-code",
            name: "MyCode",
            component: () =>
                import ("./pages/MyCode.vue"),
        },
        {
            path: "/search-title",
            name: "SearchTitle",
            component: () =>
                import ("./pages/SearchTitle.vue"),
        },
        {
            path: "/code-detailes",
            name: "CodeDetails",
            component: () =>
                import ("./pages/CodeDetails.vue"),
        },
        {
            path: "/invoice-info",
            name: "InvoiceInfo",
            component: () =>
                import ("./pages/InvoiceInfo.vue"),

        },
        {
            path: "/invoice-infonew",
            name: "InvoiceInfoNew",
            component: () =>
                import ("./pages/InvoiceInfoNew.vue"),
        },
        {
            path: "/tips",
            name: "Tips",
            component: () =>
                import ("./pages/Tips.vue"),
        },
        {
            path: "/open-success",
            name: "OpenSuccess",
            component: () =>
                import ("./pages/OpenSuccess.vue"),
        },
        {
            path: "/my-taitou",
            name: "MyTaiTou",
            component: () =>
                import ("./pages/MyTaiTou.vue"),
        },
        {
            path: "/taitou-details",
            name: "MyTaiTouXQ",
            component: () =>
                import ("./pages/MyTaiTouXQ.vue"),
        },
        {
            path: "/add-taitou",
            name: "AddTaiTou",
            component: () =>
                import ("./pages/AddTaiTou.vue"),
        },

    ],
});

export default router;