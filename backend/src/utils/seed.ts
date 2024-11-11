import mongoose from "mongoose"; // Import mongoose for ObjectId
import userModel from "../models/user.model";
import auctionModel from "../models/auction.model";
import bcrypt from "bcrypt";

export const seedDatabase = async () => {
  
  // // Check if data already exists
  // const userCount = await userModel.countDocuments();
  // if (userCount > 0) {
  //   console.log('Database already seeded');
  //   return;
  // }

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
      title: "title1",
      author: "author1",
      ISBN: "ISBN1",
      course: "course1",
      university: "university1",
      edition: "edition1",
      publisher: "publisher1",
    },
    duration: {
      start: new Date(),
      end: new Date(), // now for testing
    },
    bids: [{
      bidderId: student2._id,
      amount: 25,
      createdAt: new Date(),
    }],
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
    reservePrice: 20
  });

  const auction2 = new auctionModel({
    _id: new mongoose.Types.ObjectId('645c1d1e8d5b1b2e2f9e1d30'),
    sellerId: student2._id,
    book: {
      title: "title2",
      author: "author2",
      ISBN: "ISBN2",
      course: "course2",
      university: "university2",
      edition: "edition2",
      publisher: "publisher2",
    },
    duration: {
      start: new Date(),
      end: new Date(new Date().getTime() + 1 * 60 * 1000), // 1 minute from now
    },
    bids: [{
      bidderId: student1._id,
      amount: 25,
      createdAt: new Date(),
    }],
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
    reservePrice: 20
  });

  const auction3 = new auctionModel({
    _id: new mongoose.Types.ObjectId('645c1d1e8d5b1b2e2f9e1d31'),
    sellerId: student2._id,
    book: {
      title: "title3",
      author: "author3",
      ISBN: "ISBN3",
      course: "course3",
      university: "university3",
      edition: "edition3",
      publisher: "publisher3",
    },
    duration: {
      start: new Date(new Date().getTime() + 1 * 60 * 1000), // 1 minute from now
      end: new Date(new Date().getTime() + 30 * 60 * 1000), // 30 minute from now
    },
    startingPrice: 10,
    reservePrice: 20
  });

  await auction1.save();
  await auction2.save();
  await auction3.save();

  console.log('Database seeded successfully');
};
