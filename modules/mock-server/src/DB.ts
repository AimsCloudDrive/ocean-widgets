const m: typeof import("mongodb") = require("mongodb");
const express = require("express");
const { MongoClient } = m;
import { createServer } from "@ocean/http";
import type { Db } from "mongodb";

createServer(8088, {
  routes: [
    {
      path: "/api",
      children: [
        {
          path: "/userCreate",
          method: "post",
          handlers: [
            express.json(),
            (request: any, response: any) => {
              console.log(request.body);
              const { user, password } = request.body;
              DBS.user
                .collection("user")
                .updateOne(
                  { user: { $eq: user } },
                  { $set: { user, password } },
                  { upsert: true }
                )
                .then(
                  () => {
                    response.send({
                      success: true,
                    });
                  },
                  (e) => {
                    console.error(e);
                    response.send({
                      success: false,
                    });
                  }
                );
            },
          ],
        },
      ],
    },
  ],
  createHandle: () => {
    console.log("userServer ready");
  },
});

const client = new MongoClient("mongodb://never.aims.nevermonarch.cn:57857/", {
  maxConnecting: 10,
  maxPoolSize: 10,
  auth: {
    username: "root",
    password: "123456",
  },
});
const DBS: {
  user: Db;
} = Object.create({});
client.connect().then(() => {
  console.log("userDB ready");
  DBS.user = client.db("users");
});
