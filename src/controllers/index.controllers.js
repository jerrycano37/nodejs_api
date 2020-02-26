const { Pool } = require("pg");

const config = {
    host: "ec2-174-129-33-27.compute-1.amazonaws.com",
    user: "rfrvfpgggelcas",
    password: "4021b8e30a71147818d0e7a7ba12befc2d2137c7db5da42d340092e22b31cb0e",
    database: "d36phpc7eeou0q",
    port: "5432",
    ssl: {
        rejectUnauthorized: false,
    }
};

const pool = new Pool(config);
pool
    .connect()
    .then(client => {
        console.log("connected");
        client.release();
    })
    .catch(err => console.error("error connecting", err.stack));
//.then(() => pool.end());

const getUsers = async(req, res) => {
    const response = await pool.query("SELECT * FROM users");
    res.status(200).json(response.rows);
};

const getUserById = async(req, res) => {
    const ID = req.params.id;
    const response = await pool.query("SELECT * FROM users WHERE id = $1", [ID]);

    res.status(200).json(response.rows);
};

const createUser = async(req, res) => {
    const { name, email } = req.body;

    const response = await pool.query(
        "INSERT INTO users (name, email) VALUES ($1, $2)", [name, email]
    );

    res.status(201).json({
        message: "User Added Successfully",
        body: {
            user: { name, email }
        }
    });
};

const updateUser = async(req, res) => {
    const ID = req.params.id;
    const { name, email } = req.body;

    const response = await pool.query(
        "UPDATE users set name = $1, email = $2 WHERE id = $3", [name, email, ID]
    );

    res.status(201).json({
        message: "User Update Successfully",
        body: {
            user: { name, email }
        }
    });
};

const deleteUser = async(req, res) => {
    const ID = req.params.id;
    const response = await pool.query("DELETE FROM users WHERE id = $1", [ID]);

    res.json(`User ${ID} deleted successfully`);
};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    deleteUser,
    updateUser
};