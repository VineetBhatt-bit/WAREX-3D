#include <crow.h>

int main() {
    crow::SimpleApp app;

    // Health API
    CROW_ROUTE(app, "/api/health")
    ([]() {
        crow::response res;
        res.code = 200;
        res.set_header("Access-Control-Allow-Origin", "*");
        res.set_header("Access-Control-Allow-Methods", "GET, OPTIONS");
        res.set_header("Access-Control-Allow-Headers", "Content-Type");
        res.set_header("Content-Type", "application/json");
        res.write(R"({"status":"WAREX Backend Online"})");
        return res;
    });

    // Warehouse Layout API
    CROW_ROUTE(app, "/api/warehouse/layout")
    ([]() {
        crow::response res;
        res.code = 200;
        res.set_header("Access-Control-Allow-Origin", "*");
        res.set_header("Access-Control-Allow-Methods", "GET, OPTIONS");
        res.set_header("Access-Control-Allow-Headers", "Content-Type");
        res.set_header("Content-Type", "application/json");

        res.write(R"({
            "warehouse":"WAREX-3D",
            "rows":2,
            "shelves":[
                {"x":-5,"z":-12},
                {"x":-5,"z":-8},
                {"x":-5,"z":-4},
                {"x":-5,"z":0},
                {"x":-5,"z":4},
                {"x":-5,"z":8},
                {"x":-5,"z":12},

                {"x":5,"z":-12},
                {"x":5,"z":-8},
                {"x":5,"z":-4},
                {"x":5,"z":0},
                {"x":5,"z":4},
                {"x":5,"z":8},
                {"x":5,"z":12}
            ]
        })");

        return res;
    });

    app.port(8080).multithreaded().run();
}