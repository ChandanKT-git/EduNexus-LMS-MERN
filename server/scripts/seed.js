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
            name: "John Instructor",
            email: "instructor@example.com",
            password: hashedPassword,
            role: "instructor",
            photoUrl: "https://randomuser.me/api/portraits/men/1.jpg"
        });

        const student1 = await User.create({
            name: "Alice Student",
            email: "student@example.com",
            password: hashedPassword,
            role: "student",
            photoUrl: "https://randomuser.me/api/portraits/women/1.jpg"
        });

        const student2 = await User.create({
            name: "Bob Learner",
            email: "bob@example.com",
            password: hashedPassword,
            role: "student",
            photoUrl: "https://randomuser.me/api/portraits/men/2.jpg"
        });

        console.log("Creating courses...");

        // Course 1: Web Development
        const course1 = await Course.create({
            courseTitle: "Full Stack MERN Bootcamp",
            subTitle: "Master MongoDB, Express, React, and Node.js",
            description: "A comprehensive guide to building full-stack applications using the MERN stack. Covers authentication, state management, database design, and deployment.",
            category: "Web Development",
            courseLevel: "Beginner",
            coursePrice: 49.99,
            courseThumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            creator: instructor._id,
            isPublished: true,
            enrolledStudents: [student1._id, student2._id]
        });

        // Course 2: Python
        const course2 = await Course.create({
            courseTitle: "Python for Data Science",
            subTitle: "Learn Python analysis and visualization",
            description: "Dive into data science with Python. Learn Pandas, NumPy, Matplotlib, and Scikit-learn to analyze real-world datasets.",
            category: "Data Science",
            courseLevel: "Medium",
            coursePrice: 79.99,
            courseThumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            creator: instructor._id,
            isPublished: true,
            enrolledStudents: [student1._id]
        });

        // Course 3: Digital Marketing
        const course3 = await Course.create({
            courseTitle: "Digital Marketing Masterclass",
            subTitle: "Grow your business with digital marketing",
            description: "Learn SEO, Social Media Marketing, Email Marketing, and Google Analytics to grow your brand and sales.",
            category: "Marketing",
            courseLevel: "Beginner",
            coursePrice: 29.99,
            courseThumbnail: "https://images.unsplash.com/photo-1533750516457-a7f992034fec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            creator: instructor._id,
            isPublished: true,
            enrolledStudents: []
        });

        // Course 4: React Advanced
        const course4 = await Course.create({
            courseTitle: "Advanced React Patterns",
            subTitle: "Level up your React skills",
            description: "Deep dive into React performance, hooks, context, and advanced component patterns.",
            category: "Web Development",
            courseLevel: "Advance",
            coursePrice: 99.99,
            courseThumbnail: "https://images.unsplash.com/photo-1581276879432-15e50529f34b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            creator: instructor._id,
            isPublished: true,
            enrolledStudents: [student2._id]
        });

        console.log("Creating lectures...");

        // Lectures for Course 1
        const c1l1 = await Lecture.create({
            lectureTitle: "Introduction to MERN",
            videoUrl: "https://res.cloudinary.com/demo/video/upload/v1666624022/samples/sea-turtle.mp4",
            publicId: "samples/sea-turtle",
            isPreviewFree: true,
        });
        const c1l2 = await Lecture.create({
            lectureTitle: "Setting up Node.js",
            videoUrl: "https://res.cloudinary.com/demo/video/upload/v1666624022/samples/sea-turtle.mp4",
            publicId: "samples/sea-turtle",
            isPreviewFree: false,
        });
        course1.lectures.push(c1l1._id, c1l2._id);
        await course1.save();

        // Lectures for Course 2
        const c2l1 = await Lecture.create({
            lectureTitle: "Python Basics",
            videoUrl: "https://res.cloudinary.com/demo/video/upload/v1666624022/samples/sea-turtle.mp4",
            publicId: "samples/sea-turtle",
            isPreviewFree: true,
        });
        course2.lectures.push(c2l1._id);
        await course2.save();

        console.log("Database seeded successfully!");
        console.log("-----------------------------------------");
        console.log("Instructor: instructor@example.com / password123");
        console.log("Student 1: student@example.com / password123");
        console.log("Student 2: bob@example.com / password123");
        console.log("-----------------------------------------");

        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedDatabase();
