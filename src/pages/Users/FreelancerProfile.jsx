/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchData } from "../../common/axiosInstance";

const SELLER_PROFILE_ENDPOINT = "/auth/seller-profile";

export default function FreelancerProfile() {
    const { userId } = useParams(); // from /admin/freelancers/:userId
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                setLoading(true);
                setErr(null);
                const data = await fetchData(SELLER_PROFILE_ENDPOINT, {
                    user_id: userId,
                });
                setProfile(data);
            } catch (error) {
                console.error(error);
                setErr(
                    error?.response?.data?.message || "Failed to load seller profile"
                );
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [userId]);

    if (loading) {
        return (
            <div className="p-6">
                <p className="text-gray-500">Loading seller profile...</p>
            </div>
        );
    }

    if (err) {
        return (
            <div className="p-6">
                <p className="text-red-500 mb-2">{err}</p>
                <Link
                    to="/admin/users"
                    className="text-blue-600 hover:underline text-sm"
                >
                    ← Back to users
                </Link>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="p-6">
                <p className="text-gray-500">No profile data</p>
            </div>
        );
    }

    const {
        first_name,
        last_name,
        display_name,
        profile_picture,
        description,
        occupation,
        personal_website,
        is_approved,
        date_created,
        languages = [],
        skills = [],
        educations = [],
        certifications = [],
        experiences = [],
    } = profile;

    const fullName =
        [first_name, last_name].filter(Boolean).join(" ") ||
        "Unknown";

    return (
        <div className="p-6 space-y-6 bg-sky-100">
            {/* Back link */}
            <Link
                to="/admin/users"
                className="inline-flex items-center text-sm text-blue-600 hover:underline"
            >
                ← Back to all users
            </Link>

            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm p-6 flex gap-6 items-start">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-xl font-semibold text-gray-600">
                    {profile_picture ? (
                        <img
                            src={profile_picture}
                            alt={fullName}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        fullName
                            .split(" ")
                            .map((p) => p[0])
                            .join("")
                            .toUpperCase()
                    )}
                </div>

                <div className="flex-1">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        {fullName}
                    </h1>
                    <p className="text-gray-600 capitalize">{occupation}</p>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs">
                        <span
                            className={`px-2 py-1 rounded-full border ${is_approved
                                ? "border-green-500 text-green-600 bg-green-50"
                                : "border-yellow-500 text-yellow-600 bg-yellow-50"
                                }`}
                        >
                            {is_approved ? "Approved" : "Pending approval"}
                        </span>
                        {date_created && (
                            <span className="px-2 py-1 rounded-full border border-gray-200 text-gray-500">
                                Joined: {new Date(date_created).toLocaleDateString()}
                            </span>
                        )}
                        {personal_website && (
                            <a
                                href={personal_website}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2 py-1 rounded-full border border-blue-200 text-blue-600 hover:bg-blue-50"
                            >
                                Website
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Description */}
            {description && (
                <section className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg text-black font-semibold mb-2">About</h2>
                    <p className="text-gray-700 whitespace-pre-line">
                        {description}
                    </p>
                </section>
            )}

            {/* Languages & Skills */}
            <div className="grid md:grid-cols-2 gap-6">
                <section className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg text-black font-semibold mb-3">Languages</h2>
                    {languages.length === 0 ? (
                        <p className="text-gray-500 text-sm">No languages listed.</p>
                    ) : (
                        <ul className="space-y-1 text-sm">
                            {languages.map((lang, idx) => (
                                <li key={idx} className="flex justify-between">
                                    <span className="text-black">{lang.language}</span>
                                    <span className="text-gray-500">{lang.level}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                <section className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg text-black font-semibold mb-3">Skills</h2>
                    {skills.length === 0 ? (
                        <p className="text-gray-500 text-sm">No skills listed.</p>
                    ) : (
                        <ul className="space-y-1 text-sm">
                            {skills.map((skill, idx) => (
                                <li key={idx} className="flex justify-between">
                                    <span className="text-black">{skill.skill_name}</span>
                                    <span className="text-gray-500">{skill.level}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>

            {/* Education */}
            <section className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg text-black font-semibold mb-3">Education</h2>
                {educations.length === 0 ? (
                    <p className="text-gray-500 text-sm">No education records.</p>
                ) : (
                    <div className="space-y-3 text-sm">
                        {educations.map((edu, idx) => (
                            <div key={idx}>
                                <p className="text-black font-medium">
                                    {edu.degree} in {edu.major}
                                </p>
                                <p className="text-gray-600">
                                    {edu.institute}, {edu.country}
                                </p>
                                <p className="text-gray-500">Year: {edu.year}</p>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Certifications */}
            <section className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg text-black font-semibold mb-3">Certifications</h2>
                {certifications.length === 0 ? (
                    <p className="text-gray-500 text-sm">No certifications.</p>
                ) : (
                    <div className="space-y-3 text-sm">
                        {certifications.map((cert, idx) => (
                            <div key={idx}>
                                <p className="text-black font-medium">{cert.certificate}</p>
                                <p className="text-gray-600">
                                    {cert.certification_from || cert.institution}
                                </p>
                                <p className="text-gray-500">Year: {cert.year}</p>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Experience */}
            <section className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg text-black font-semibold mb-3">Experience</h2>
                {experiences.length === 0 ? (
                    <p className="text-gray-500 text-sm">No experience records.</p>
                ) : (
                    <div className="space-y-4 text-sm">
                        {experiences.map((exp, idx) => (
                            <div key={idx}>
                                <p className="text-gray-800 font-medium">
                                    {exp.position} – {exp.institution}
                                </p>
                                <p className="text-gray-600">
                                    {new Date(exp.year_from).toLocaleDateString()} –{" "}
                                    {new Date(exp.year_to).toLocaleDateString()}
                                </p>
                                {exp.responsibility?.length > 0 && (
                                    <p className="mt-1 text-gray-700">
                                        <span className="text-gray-800 font-medium">Responsibilities: </span>
                                        {exp.responsibility.join(", ")}
                                    </p>
                                )}
                                {exp.technologies?.length > 0 && (
                                    <p className="text-gray-700">
                                        <span className="text-gray-800 font-medium">Technologies: </span>
                                        {exp.technologies.join(", ")}
                                    </p>
                                )}
                                {exp.focus_area?.length > 0 && (
                                    <p className="text-gray-700">
                                        <span className="text-gray-800 font-medium">Focus areas: </span>
                                        {exp.focus_area.join(", ")}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
