const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'database-2.cjow0ceesp1t.us-east-2.rds.amazonaws.com',
    user: 'shirley',
    port: '3306',
    password: '',
    database: 'shirley',
});

exports.handler = async (event) => {
    let response;
    
    try {
        switch (event.httpMethod) {
            case 'GET':
                response = await listProducts();
                break;
            case 'POST':
                response = await addProduct(JSON.parse(event.body));
                break;
            case 'PUT':
                response = await updateProduct(JSON.parse(event.body));
                break;
            case 'DELETE':
                response = await deleteProduct(event.pathParameters.product_id);
                break;
            default:
                response = {
                    statusCode: 405,
                    body: JSON.stringify({ message: 'Method Not Allowed' })
                };
        }
    } catch (error) {
        response = {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error interno', error })
        };
    }
    
    return response;
};

const listProducts = () => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM Products', (error, results) => {
            if (error) {
                reject({
                    statusCode: 500,
                    body: JSON.stringify({ message: 'Error al devolver productos', error })
                });
                return;
            }

            resolve({
                statusCode: 200,
                body: JSON.stringify(results)
            });
        });
    });
};

const addProduct = (product) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO Products (product_id, name, description, price, currency, quantity, category, brand) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [product.product_id, product.name, product.description, product.price, product.currency, product.quantity, product.category, product.brand];

        connection.query(query, values, (error) => {
            if (error) {
                reject({
                    statusCode: 500,
                    body: JSON.stringify({ message: 'Error añadiendo productos', error })
                });
                return;
            }

            resolve({
                statusCode: 201,
                body: JSON.stringify({ message: 'Producto añadido!' })
            });
        });
    });
};

const updateProduct = (product) => {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE Products SET name = ?, description = ?, price = ?, currency = ?, quantity = ?, category = ?, brand = ? WHERE product_id = ?';
        const values = [product.name, product.description, product.price, product.currency, product.quantity, product.category, product.brand, product.product_id];

        connection.query(query, values, (error) => {
            if (error) {
                reject({
                    statusCode: 500,
                    body: JSON.stringify({ message: 'Error actualizando producto', error })
                });
                return;
            }

            resolve({
                statusCode: 200,
                body: JSON.stringify({ message: 'Product actualizado!' })
            });
        });
    });
};

const deleteProduct = (product_id) => {
    return new Promise((resolve, reject) => {
        const query = 'DELETE FROM Products WHERE product_id = ?';
        
        connection.query(query, [product_id], (error) => {
            if (error) {
                reject({
                    statusCode: 500,
                    body: JSON.stringify({ message: 'Error borrando pruductos'. error })
                });
                return;
            }

            resolve({
                statusCode: 200,
                body: JSON.stringify({ message: 'Product eliminado correctamente' })
            });
        });
    });
};
     
           
       

  
      