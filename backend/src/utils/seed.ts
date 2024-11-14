import mongoose from "mongoose"; // Import mongoose for ObjectId
import userModel from "../models/user.model";
import auctionModel from "../models/auction.model";
import bcrypt from "bcrypt";

export const seedDatabase = async () => {

  // Clear all residual data
  await userModel.deleteMany().exec();
  await auctionModel.deleteMany().exec();

  const hashedPassword = await bcrypt.hash('password', 10);

  // Create default moderator with a fixed _id
  const moderator = new userModel({
    _id: new mongoose.Types.ObjectId('645c1d1e8d5b1b2e2f9e1d2c'), // Manually set _id
    username: 'moderator1',
    email: 'moderator1@example.com',
    password: hashedPassword,
    isModerator: true,
    isFirstLogin: false,
  });

  // Create default students with fixed _id
  const student1 = new userModel({
    _id: new mongoose.Types.ObjectId('645c1d1e8d5b1b2e2f9e1d2d'),
    username: 'student1',
    email: 'student1@example.com',
    password: hashedPassword,
    name: 'John',
    surname: 'Doe',
    address: '1234 Elm Street',
  });

  const student2 = new userModel({
    _id: new mongoose.Types.ObjectId('645c1d1e8d5b1b2e2f9e1d2e'),
    username: 'student2',
    email: 'student2@example.com',
    password: hashedPassword,
    name: 'Jane',
    surname: 'Doe',
    address: '5678 Oak Street',
  });

  await moderator.save();
  await student1.save();
  await student2.save();

  const auction1 = new auctionModel({
    _id: new mongoose.Types.ObjectId('645c1d1e8d5b1b2e2f9e1d2f'),
    sellerId: student1._id,
    book: {
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      ISBN: "978-0-06-112008-4",
      course: "American Literature",
      university: "Harvard University",
      edition: "1st",
      publisher: "J.B. Lippincott & Co.",
    },
    duration: {
      start: new Date(),
      end: new Date(), // now for testing
    },
    bids: [
      {
        bidderId: student2._id,
        amount: 25,
        createdAt: new Date(),
      },
      {
        bidderId: student2._id,
        amount: 30,
        createdAt: new Date(),
      }
    ],
    messages: [{
      senderId: student2._id,
      content: "message from student2",
      isPrivate: false,
      createdAt: new Date(),
    },
    {
      senderId: student1._id,
      content: "response from student1",
      isPrivate: false,
      createdAt: new Date(),
    }],
    startingPrice: 10,
    reservePrice: 20,
    status: 'active'
  });

  const auction2 = new auctionModel({
    _id: new mongoose.Types.ObjectId('645c1d1e8d5b1b2e2f9e1d30'),
    sellerId: student2._id,
    book: {
      title: "1984",
      author: "George Orwell",
      ISBN: "978-0-452-28423-4",
      course: "Political Science",
      university: "Stanford University",
      edition: "1st",
      publisher: "Secker & Warburg",
    },
    duration: {
      start: new Date(),
      end: new Date(new Date().getTime() + 5 * 60 * 1000), // 5 minute from now
    },
    bids: [
      {
        bidderId: student1._id,
        amount: 25,
        createdAt: new Date(),
      },
      {
        bidderId: student1._id,
        amount: 30,
        createdAt: new Date(),
      }
    ],
    messages: [{
      senderId: student1._id,
      content: "message from student1",
      isPrivate: true,
      createdAt: new Date(),
    },
    {
      senderId: student2._id,
      content: "response from student2",
      isPrivate: true,
      createdAt: new Date(),
    }],
    startingPrice: 10,
    reservePrice: 20,
    status: 'active'
  });

  const auction3 = new auctionModel({
    _id: new mongoose.Types.ObjectId('645c1d1e8d5b1b2e2f9e1d31'),
    sellerId: student2._id,
    book: {
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      ISBN: "978-0-7432-7356-5",
      course: "English Literature",
      university: "Yale University",
      edition: "1st",
      publisher: "Charles Scribner's Sons",
    },
    duration: {
      start: new Date(new Date().getTime() + 1 * 60 * 1000), // 1 minute from now
      end: new Date(new Date().getTime() + 30 * 60 * 1000), // 30 minutes from now
    },
    startingPrice: 10,
    reservePrice: 20
  });

  await auction1.save();
  await auction2.save();
  await auction3.save();

  console.log('Database seeded successfully');
};
