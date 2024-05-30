-- Disable Commits and Foreign Key Cheks
SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;


-- Customers Table
CREATE OR REPLACE TABLE Customers (
    customerID int NOT NULL AUTO_INCREMENT,
    firstName varchar(20) NOT NULL,
    lastName varchar(20) NOT NULL,
    email varchar(45),
    phoneNum varchar(20),
    PRIMARY KEY (customerID)
);

-- Workers Table
CREATE OR REPLACE TABLE Workers (
    workerID int NOT NULL AUTO_INCREMENT,
    firstName varchar(20) NOT NULL,
    lastName varchar(20) NOT NULL,
    email varchar(45),
    phoneNum varchar(20),
    PRIMARY KEY (workerID)
);

-- Orders Table
CREATE OR REPLACE TABLE Orders (
    orderID int NOT NULL AUTO_INCREMENT,
    customerID int NOT NULL,
    workerID int,
    datePlaced date NOT NULL,
    datePickedup date,
    totalPrice decimal(19,2) NOT NULL,
    PRIMARY KEY (orderID),
    FOREIGN KEY (customerID) REFERENCES Customers(customerID) ON DELETE CASCADE,
    FOREIGN KEY (workerID) REFERENCES Workers(workerID) ON DELETE SET NULL
);

-- Cupcakes Table
CREATE OR REPLACE TABLE Cupcakes (
    cupcakeID int NOT NULL AUTO_INCREMENT,
    cakeFlavor varchar(25) NOT NULL,
    frostingFlavor varchar(25) NOT NULL,
    cakeColor varchar(20),
    frostingColor varchar(20),
    price decimal(19,2) NOT NULL,
    PRIMARY KEY (cupcakeID)
);

-- CupcakesOrdered Table
CREATE OR REPLACE TABLE CupcakesOrdered (
    cupcakesOrderedID int NOT NULL AUTO_INCREMENT,
    orderID int NOT NULL,
    cupcakeID int NOT NULL,
    quantity int(5) NOT NULL,
    PRIMARY KEY (cupcakesOrderedID),
    FOREIGN KEY (orderID) REFERENCES Orders(orderID) ON DELETE CASCADE,
    FOREIGN KEY (cupcakeID) REFERENCES Cupcakes(cupcakeID) ON DELETE CASCADE
);


-- Insert data into the Database
INSERT INTO Customers (firstName, lastName, email, phoneNum)
VALUES ('Steven', 'Lee', 'lsteven@hello.com', '505-584-192'),
('John', 'Smith', 'sjohn@hello.com', '555-730-183'),
('Brenda', 'Gates', 'gbrenda@hello.com', '564-104-769');

INSERT INTO Workers (firstName, lastName, email, phoneNum)
VALUES ('Kevin', 'Juanda', 'jkevin@hello.com', '521-759-318'),
('Skyler', 'Ucol', 'uskyler@hello.com', '531-872-375'),
('Jenny', 'Kim', 'kjenny@hello.com', '543-982-736');

INSERT INTO Cupcakes (cakeFlavor, frostingFlavor, cakeColor, frostingColor, price)
VALUES ('Vanilla', 'Strawberry', 'White', 'Red', 5),
('Mint Oreo', 'Peanut Butter', 'Black', 'Brown', 10),
('Mocha', 'Red Velvet', 'Brown', 'Red', 15),
('Chocolate', 'Oreo', NULL, NULL, 25);

INSERT INTO Orders (customerID, workerID, datePlaced, datePickedup, totalPrice)
VALUES ((SELECT customerID FROM Customers WHERE firstName = 'Brenda' AND lastName = 'Gates'), 
(SELECT workerID FROM Workers WHERE firstName = 'Skyler' AND lastName = 'Ucol'), '2024-01-30', '2024-02-07', 50),
((SELECT customerID FROM Customers WHERE firstName = 'Steven' AND lastName = 'Lee'), 
(SELECT workerID FROM Workers WHERE firstName = 'Kevin' AND lastName = 'Juanda'), '2023-12-04', NULL, 35),
((SELECT customerID FROM Customers WHERE firstName = 'John' AND lastName = 'Smith'), NULL, '2023-12-20', '2023-12-27', 45);

INSERT INTO CupcakesOrdered (orderID, cupcakeID, quantity)
VALUES ((SELECT orderID FROM Orders WHERE totalPrice = 50),
(SELECT cupcakeID FROM Cupcakes WHERE price = 10), 5),
((SELECT orderID FROM Orders WHERE totalPrice = 35),
(SELECT cupcakeID FROM Cupcakes WHERE price = 10), 7),
((SELECT orderID FROM Orders WHERE totalPrice = 45),
(SELECT cupcakeID FROM Cupcakes WHERE price = 5), 9);


SET FOREIGN_KEY_CHECKS=1;
COMMIT;