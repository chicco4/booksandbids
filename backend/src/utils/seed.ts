import userModel from "../models/user.model";
import auctionModel from "../models/auction.model";
import bidModel from "../models/bid.model";
import messageModel from "../models/message.model";
import bcrypt from "bcrypt";

export const seedDatabase = async () => {
  // Check if data already exists
  const userCount = await userModel.countDocuments();
  if (userCount > 0) {
    console.log('Database already seeded');
    return;
  }
  // Clear all residual data
  await auctionModel.deleteMany().exec();
  await bidModel.deleteMany().exec();
  await messageModel.deleteMany().exec();

  const hashedPassword = await bcrypt.hash('password', 10);

  // Create default moderator
  const moderator = new userModel({
    username: 'moderator1',
    email: 'moderator1@example.com',
    password: hashedPassword,
    isModerator: true,
    isFirstLogin: false,
  });

  // Create default students
  const student1 = new userModel({
    username: 'student1',
    email: 'student1@example.com',
    password: hashedPassword,
    name: 'John',
    surname: 'Doe',
    address: '1234 Elm Street',
  });

  const student2 = new userModel({
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
    startingPrice: 10,
    reservePrice: 20,
    status: 'active',
  });

  const auction2 = new auctionModel({
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
    startingPrice: 10,
    reservePrice: 20,
    status: 'active',
  });

  const auction3 = new auctionModel({
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
      start: new Date(),
      end: new Date(new Date().getTime() + 30 * 60 * 1000), // 30 minute from now
    },
    startingPrice: 10,
    reservePrice: 20,
    status: 'active',
  });

  await auction1.save();
  await auction2.save();
  await auction3.save();

  const bid1 = new bidModel({
    auctionId: auction1._id,
    bidderId: student2._id,
    amount: 25,
  });

  const bid2 = new bidModel({
    auctionId: auction2._id,
    bidderId: student1._id,
    amount: 25,
  });

  const bid3 = new bidModel({
    auctionId: auction3._id,
    bidderId: student1._id,
    amount: 25,
  });

  await bid1.save();
  await bid2.save();
  await bid3.save();

  const message1 = new messageModel({
    senderId: student1._id,
    auctionId: auction1._id,
    content: 'Message 1 from student 1 in auction 1', 
    isPublic: true,
  });

  const message2 = new messageModel({
    senderId: student2._id,
    auctionId: auction1._id,
    content: 'Message 2 from student 2 in auction 1',
    isPublic: true,
  });

  await message1.save();
  await message2.save();


  console.log('Database seeded successfully');
};
