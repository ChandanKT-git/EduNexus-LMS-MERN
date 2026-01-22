import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import connectDB from "../database/db.js";

dotenv.config();

const seedDatabase = async () => {
    try {
        await connectDB();

        console.log("Clearing database...");
        await User.deleteMany({});
        await Course.deleteMany({});
        await Lecture.deleteMany({});

        console.log("Creating users...");
        const hashedPassword = await bcrypt.hash("password123", 10);

        const instructor = await User.create({
            name: "Instructor User",
            email: "instructor@example.com",
            password: hashedPassword,
            role: "instructor",
        });

        const student = await User.create({
            name: "Student User",
            email: "student@example.com",
            password: hashedPassword,
            role: "student",
        });

        console.log("Creating courses...");
        const course1 = await Course.create({
            courseTitle: "Full Stack Web Development Bootcamp",
            subTitle: "Become a full stack web developer with just one course",
            description: "This is a comprehensive course covering HTML, CSS, JavaScript, React, Node.js, and MongoDB. You will build real-world projects and learn best practices.",
            category: "Web Development",
            courseLevel: "Beginner",
            coursePrice: 49.99,
            courseThumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            creator: instructor._id,
            isPublished: true,
        });

        const course2 = await Course.create({
            courseTitle: "Advanced React Patterns",
            subTitle: "Master advanced React concepts",
            description: "Learn about Higher Order Components, Render Props, Custom Hooks, and Context API in depth.",
            category: "Web Development",
            courseLevel: "Advance",
            coursePrice: 79.99,
            courseThumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            creator: instructor._id,
            isPublished: true,
        });

        console.log("Creating lectures...");
        const lecture1 = await Lecture.create({
            lectureTitle: "Introduction to Web Development",
            videoUrl: "https://res.cloudinary.com/demo/video/upload/v1666624022/samples/sea-turtle.mp4",
            publicId: "samples/sea-turtle",
            isPreviewFree: true,
        });

        const lecture2 = await Lecture.create({
            lectureTitle: "Setting up the Environment",
            videoUrl: "https://res.cloudinary.com/demo/video/upload/v1666624022/samples/sea-turtle.mp4",
            publicId: "samples/sea-turtle",
            isPreviewFree: false,
        });

        // Link lectures to course1
        course1.lectures.push(lecture1._id, lecture2._id);
        await course1.save();

        console.log("Database seeded successfully!");
        console.log("Instructor: instructor@example.com / password123");
        console.log("Student: student@example.com / password123");

        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};
