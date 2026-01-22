import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import { CourseProgress } from "../models/courseProgress.js";
import connectDB from "../database/db.js";

dotenv.config();

const seedDatabase = async () => {
    try {
        await connectDB();

        console.log("Clearing database...");
        await User.deleteMany({});
        await Course.deleteMany({});
        await Lecture.deleteMany({});
        await CoursePurchase.deleteMany({});
        await CourseProgress.deleteMany({});

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

        // Update students' enrolledCourses
        await User.findByIdAndUpdate(student1._id, { $push: { enrolledCourses: [course1._id, course2._id] } });
        await User.findByIdAndUpdate(student2._id, { $push: { enrolledCourses: [course1._id, course4._id] } });

        console.log("Creating purchases...");
        // Create purchases for enrolled students
        await CoursePurchase.create([
            {
                courseId: course1._id,
                userId: student1._id,
                amount: course1.coursePrice,
                status: 'completed',
                paymentId: `pay_${Math.random().toString(36).substr(2, 9)}`
            },
            {
                courseId: course2._id,
                userId: student1._id,
                amount: course2.coursePrice,
                status: 'completed',
                paymentId: `pay_${Math.random().toString(36).substr(2, 9)}`
            },
            {
                courseId: course1._id,
                userId: student2._id,
                amount: course1.coursePrice,
                status: 'completed',
                paymentId: `pay_${Math.random().toString(36).substr(2, 9)}`
            },
            {
                courseId: course4._id,
                userId: student2._id,
                amount: course4.coursePrice,
                status: 'completed',
                paymentId: `pay_${Math.random().toString(36).substr(2, 9)}`
            }
        ]);

        console.log("Creating lectures...");

        // Helper to create lectures
        const createLectures = async (course, titles) => {
            const lectureIds = [];
            for (const title of titles) {
                const lecture = await Lecture.create({
                    lectureTitle: title,
                    videoUrl: "https://res.cloudinary.com/demo/video/upload/v1666624022/samples/sea-turtle.mp4", // Placeholder video
                    publicId: "samples/sea-turtle",
                    isPreviewFree: Math.random() < 0.3 // 30% chance of being free preview
                });
                lectureIds.push(lecture._id);
            }
            course.lectures.push(...lectureIds);
            await course.save();
            return lectureIds;
        };

        const c1Lectures = await createLectures(course1, [
            "Introduction to MERN Stack",
            "Setting up the Environment",
            "MongoDB Atlas Setup",
            "Express Server Basics",
            "React Frontend Initialization",
            "Connecting Frontend to Backend"
        ]);

        const c2Lectures = await createLectures(course2, [
            "Python Installation & Basics",
            "Variables and Data Types",
            "Control Flow: If/Else & Loops",
            "Functions and Modules",
            "Introduction to Pandas",
            "Data Visualization with Matplotlib"
        ]);

        const c3Lectures = await createLectures(course3, [
            "Digital Marketing Fundamentals",
            "SEO Basics",
            "Social Media Strategy",
            "Email Marketing Campaigns",
            "Google Analytics Overview"
        ]);

        const c4Lectures = await createLectures(course4, [
            "Advanced Hooks: useMemo & useCallback",
            "Context API vs Redux",
            "React Performance Optimization",
            "Custom Hooks Patterns",
            "Server Side Rendering (SSR)"
        ]);

        console.log("Creating course progress...");

        // Student 1 has watched some lectures of Course 1
        await CourseProgress.create({
            userId: student1._id,
            courseId: course1._id,
            completed: false,
            lectureProgress: [
                { lectureId: c1Lectures[0], viewed: true },
                { lectureId: c1Lectures[1], viewed: true },
                { lectureId: c1Lectures[2], viewed: false }
            ]
        });

        // Student 2 has completed Course 4
        await CourseProgress.create({
            userId: student2._id,
            courseId: course4._id,
            completed: true,
            lectureProgress: c4Lectures.map(lecId => ({ lectureId: lecId, viewed: true }))
        });

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
