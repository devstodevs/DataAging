import React from "react";
import { ArrowUpIcon } from "lucide-react";

interface TestCardProps {
    icon: ArrowUpIcon;
    title: string;
    description: string;
    onClick: () => void;
}

const TestCard: React.FC<TestCardProps> = ({
    icon: Icon,
    title,
    description,
    onClick,
}) => {
    return (
        <div
            onClick={onClick}
            className="bg-white border border-gray-200 rounded-lg p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:border-gray-300"
        >
            <div className="flex flex-col items-start space-y-4">
                {/* Ícone */}
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-black-600" />
                </div>

                {/* Título */}
                <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                    {title}
                </h3>

                {/* Descrição */}
                <p className="text-sm text-gray-600 leading-relaxed">
                    {description}
                </p>
            </div>
        </div>
    );
};

export default TestCard;