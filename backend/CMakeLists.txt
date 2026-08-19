cmake_minimum_required(VERSION 3.20)

project(WAREX_Backend)

set(CMAKE_CXX_STANDARD 17)

find_package(Crow CONFIG REQUIRED)

add_executable(warex_backend
    src/main.cpp
)

target_link_libraries(warex_backend PRIVATE Crow::Crow)